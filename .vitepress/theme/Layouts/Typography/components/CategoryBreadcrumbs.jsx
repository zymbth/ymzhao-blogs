import { categoryMap } from '@/_plugins/util.mjs'

// eslint-disable-next-line no-unused-vars,unused-imports/no-unused-vars
const CategoryComp = ({ modelValue, index, total, enableLast = false }, { emit }) => {
  const category = categoryMap[modelValue]
  const isFirst = index === 0
  const isLast = index === total - 1
  const handleSelect = () => emit('select', modelValue)
  return (
    <>
      {isFirst ? '#' : '>'}
      {isLast && !enableLast
        ? (
            <span class="color-#666">{category}</span>
          )
        : (
            <span class="secondary-link inline-block cursor-pointer" onClick={handleSelect}>
              {category}
            </span>
          )}
    </>
  )
}

export default ({ modelValue, enableLast = false }, { emit }) => {
  if (!Array.isArray(modelValue)) return null
  const handleSelect = val => emit('select', val)
  return (
    <span flex="~ items-center gap-2px">
      {modelValue.map((item, index) => {
        return (
          <CategoryComp
            key={item}
            modelValue={item}
            index={index}
            total={modelValue.length}
            enableLast={enableLast}
            onSelect={handleSelect}
          />
        )
      })}
    </span>
  )
}
