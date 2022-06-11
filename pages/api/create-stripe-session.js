const publich_key =
  'pk_test_51IzooCE4nVXcFmbrNrYxoA181Li2WgY2lfqTGr5tfOSdR9GTMDQkpl9m64kdTg9mrTg5Xk09cANv31CDlO0KT2wJ00Csl6TR2E'
const stripe = require('stripe')(publich_key)

async function CreateStripeSession(req, res) {
  const { item } = req.body

  const redirectURL =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://stripe-checkout-next-js-demo.vercel.app'

  const transformedItem = {
    price_data: {
      currency: 'usd',
      product_data: {
        images: [item.image],
        name: item.name,
      },
      unit_amount: item.price * 100,
    },
    description: item.description,
    quantity: item.quantity,
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [transformedItem],
    mode: 'payment',
    success_url: redirectURL + '?status=success',
    cancel_url: redirectURL + '?status=cancel',
    metadata: {
      images: item.image,
    },
  })

  res.json({ id: session.id })
}

export default CreateStripeSession
