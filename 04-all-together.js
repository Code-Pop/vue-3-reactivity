const targetMap = new WeakMap() // targetMap stores the effects that each object should re-run when it's updated
function track(target, key) {
  // We need to make sure this effect is being tracked.
  let depsMap = targetMap.get(target) // Get the current depsMap for this target
  if (!depsMap) {
    // There is no map.
    targetMap.set(target, (depsMap = new Map())) // Create one
  }
  let dep = depsMap.get(key) // Get the current dependencies (effects) that need to be run when this is set
  if (!dep) {
    // There is no dependencies (effects)
    depsMap.set(key, (dep = new Set())) // Create a new Set
  }
  dep.add(effect) // Add effect to dependency map
}
function trigger(target, key) {
  const depsMap = targetMap.get(target) // Does this object have any properties that have dependencies (effects)
  if (!depsMap) {
    return
  }
  let dep = depsMap.get(key) // If there are dependencies (effects) associated with this
  if (dep) {
    dep.forEach((effect) => {
      // run them all
      effect()
    })
  }
}

function reactive(target) {
  const handlers = {
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver)
      track(target, key) // If this reactive property (target) is GET inside then track the effect to rerun on SET
      return result
    },
    set(target, key, value, receiver) {
      let oldValue = target[key]
      let result = Reflect.set(target, key, value, receiver)
      if (result && oldValue != value) {
        trigger(target, key) // If this reactive property (target) has effects to rerun on SET, trigger them.
      }
      return result
    },
  }
  return new Proxy(target, handlers)
}

let product = reactive({ price: 5, quantity: 2 })
let total = 0

var effect = () => {
  total = product.price * product.quantity
}
effect()

console.log('before updated quantity total = ' + total)
product.quantity = 3
console.log('after updated quantity total = ' + total)
console.log('Updated quantity to = ' + product.quantity)
