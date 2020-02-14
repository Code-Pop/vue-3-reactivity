const depsMap = new Map()
function track(key) {
  // Make sure this effect is being tracked.
  let dep = depsMap.get(key)
  if (!dep) {
    // There is no dep (effects) on this key yet
    depsMap.set(key, (dep = new Set())) // Create a new Set
  }

  dep.add(effect) // Add effect to dep
}
function trigger(key) {
  let dep = depsMap.get(key) // Get the dep (effects) associated with this key
  if (dep) {
    // If they exist
    dep.forEach(effect => {
      // run them all
      effect()
    })
  }
}

let product = { price: 5, quantity: 2 }
let total = 0

let effect = () => {
  total = product.price * product.quantity
}

track('quantity')
effect()
// console.log(total)

// product.quantity = 3
// trigger('quantity')
// console.log(total)
