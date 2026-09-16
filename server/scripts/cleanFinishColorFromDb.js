const mongoose = require('mongoose');

async function clean() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect('mongodb://127.0.0.1:27017/markethub');

  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

  // 1. Remove root fields: finishColor, finish, color, colors
  const unsetRes = await Product.updateMany(
    {},
    {
      $unset: {
        finishColor: '',
        finish: '',
        color: '',
        colors: '',
      },
    }
  );
  console.log('Unset root fields result:', unsetRes);

  // 2. Remove specifications with key matching "Finish / Color", "Finish", or "Color" (except "Color Gamut")
  const pullRes = await Product.updateMany(
    {},
    {
      $pull: {
        specifications: {
          key: {
            $regex: /^(finish\s*\/?\s*color|finish|color)$/i,
          },
        },
      },
    }
  );
  console.log('Pull specifications result:', pullRes);

  // 3. Verify all products
  const products = await Product.find({});
  let foundAny = false;
  for (const p of products) {
    if (p.finishColor || p.finish || p.color || p.colors) {
      console.log(`Product ${p.name} still has root color field!`);
      foundAny = true;
    }
    if (p.specifications && Array.isArray(p.specifications)) {
      const match = p.specifications.filter(s =>
        s.key && /^(finish\s*\/?\s*color|finish|color)$/i.test(s.key.trim())
      );
      if (match.length > 0) {
        console.log(`Product ${p.name} still has matching spec:`, match);
        foundAny = true;
      }
    }
  }

  if (!foundAny) {
    console.log('Database verification passed: No Finish / Color fields or specifications exist on any product.');
  }

  await mongoose.disconnect();
}

clean().catch(console.error);
