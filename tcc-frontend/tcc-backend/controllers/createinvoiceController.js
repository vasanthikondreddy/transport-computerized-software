const { consignment, branch, truck, ...rest } = req.body;
const invoice = new Invoice({ consignment, branch, truck, ...rest });
await invoice.save();
res.status(201).json({ message: 'Invoice created', invoice });