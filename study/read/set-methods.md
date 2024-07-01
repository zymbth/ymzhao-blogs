---
description: Set新方法学习，包括 intersection,union,difference,symmetricDifference,isSubsetOf,isSupersetOf,isDisjointFrom
head:
  - - meta
    - name: keywords
      content: set,intersection,union,symmetricDifference,isSubsetOf,isDisjointFrom
---

# Set新方法学习

> 原文：[New JavaScript Set methods](https://developer.mozilla.org/en-US/blog/javascript-set-methods/)

## 方法

下面方法中的每个都用于对比检查 Set 与另一个特定 Set 的内容。

语法都是：`setA.compareMethod(setB)`，下面分别用 A、B 指代 setA、setB

- [`intersection()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/intersection): returns a new set with elements in both this set and the given set.

返回 A 与 B 的交集
<img class="set-diagram" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48c3R5bGU+LnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiMyMzFmMjA7c3Ryb2tlLW1pdGVybGltaXQ6MTB9PC9zdHlsZT48cGF0aCBkPSJNMTUwIDM5LjM5Yy0yMC45MiAxMi4xLTM1IDM0LjcxLTM1IDYwLjYxczE0LjA4IDQ4LjUxIDM1IDYwLjYxYzIwLjkyLTEyLjEgMzUtMzQuNzEgMzUtNjAuNjFzLTE0LjA4LTQ4LjUxLTM1LTYwLjYxeiIgZmlsbD0iIzM5Y2FjNCIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjExNSIgY3k9IjEwMCIgcj0iNzAiLz48Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSIxODUiIGN5PSIxMDAiIHI9IjcwIi8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTkuMzcgNTAuNCkiPkE8L3RleHQ+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTkwLjAxNCA1MC40KSI+QjwvdGV4dD48L3N2Zz4=" />

- [`union()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union): returns a new set with all elements in this set and the given set.

返回 A 与 B 的并集
<img class="set-diagram" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48c3R5bGU+LnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiMyMzFmMjA7c3Ryb2tlLW1pdGVybGltaXQ6MTB9PC9zdHlsZT48cGF0aCBkPSJNMTg1IDMwYy0xMi43NSAwLTI0LjcgMy40My0zNSA5LjM5QTY5LjY2NyA2OS42NjcgMCAwIDAgMTE1IDMwYy0zOC42NiAwLTcwIDMxLjM0LTcwIDcwczMxLjM0IDcwIDcwIDcwYzEyLjc1IDAgMjQuNy0zLjQzIDM1LTkuMzlhNjkuNjY3IDY5LjY2NyAwIDAgMCAzNSA5LjM5YzM4LjY2IDAgNzAtMzEuMzQgNzAtNzBzLTMxLjM0LTcwLTcwLTcweiIgZmlsbD0iIzM5Y2FjNCIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjExNSIgY3k9IjEwMCIgcj0iNzAiLz48Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSIxODUiIGN5PSIxMDAiIHI9IjcwIi8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTkuMzcgNTAuNCkiPkE8L3RleHQ+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTkwLjAxNCA1MC40KSI+QjwvdGV4dD48L3N2Zz4=" />

- [`difference()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/difference): returns a new set with elements in this set but not in the given set.

返回 A 与 B 的差集，即属于 A 但不属于 B 的集合.
<img class="set-diagram" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48c3R5bGU+LnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiMyMzFmMjA7c3Ryb2tlLW1pdGVybGltaXQ6MTB9PC9zdHlsZT48cGF0aCBkPSJNMTE1IDEwMGMwLTI1LjkxIDE0LjA4LTQ4LjUxIDM1LTYwLjYxQTY5LjY2NyA2OS42NjcgMCAwIDAgMTE1IDMwYy0zOC42NiAwLTcwIDMxLjM0LTcwIDcwczMxLjM0IDcwIDcwIDcwYzEyLjc1IDAgMjQuNy0zLjQzIDM1LTkuMzktMjAuOTItMTIuMS0zNS0zNC43LTM1LTYwLjYxeiIgZmlsbD0iIzM5Y2FjNCIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjExNSIgY3k9IjEwMCIgcj0iNzAiLz48Y2lyY2xlIGNsYXNzPSJzdDEiIGN4PSIxODUiIGN5PSIxMDAiIHI9IjcwIi8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTkuMzcgNTAuNCkiPkE8L3RleHQ+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTkwLjAxNCA1MC40KSI+QjwvdGV4dD48L3N2Zz4=" />

- [`symmetricDifference()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/symmetricDifference): returns a new set with elements in either set, but not in both.

返回 A 与 B 的对称差集，等于并集-交集
<img class="set-diagram" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48c3R5bGU+LnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiMyMzFmMjA7c3Ryb2tlLW1pdGVybGltaXQ6MTB9PC9zdHlsZT48cGF0aCBkPSJNMTE1IDEwMGMwLTI1LjkxIDE0LjA4LTQ4LjUxIDM1LTYwLjYxQTY5LjY2NyA2OS42NjcgMCAwIDAgMTE1IDMwYy0zOC42NiAwLTcwIDMxLjM0LTcwIDcwczMxLjM0IDcwIDcwIDcwYzEyLjc1IDAgMjQuNy0zLjQzIDM1LTkuMzktMjAuOTItMTIuMS0zNS0zNC43LTM1LTYwLjYxem03MC03MGMtMTIuNzUgMC0yNC43IDMuNDMtMzUgOS4zOSAyMC45MiAxMi4xIDM1IDM0LjcxIDM1IDYwLjYxcy0xNC4wOCA0OC41MS0zNSA2MC42MWE2OS42NjcgNjkuNjY3IDAgMCAwIDM1IDkuMzljMzguNjYgMCA3MC0zMS4zNCA3MC03MHMtMzEuMzQtNzAtNzAtNzB6IiBmaWxsPSIjMzljYWM0Ii8+PGNpcmNsZSBjbGFzcz0ic3QxIiBjeD0iMTE1IiBjeT0iMTAwIiByPSI3MCIvPjxjaXJjbGUgY2xhc3M9InN0MSIgY3g9IjE4NSIgY3k9IjEwMCIgcj0iNzAiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5OS4zNyA1MC40KSI+QTwvdGV4dD48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTAuMDE0IDUwLjQpIj5CPC90ZXh0Pjwvc3ZnPg==" />

- [`isSubsetOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSubsetOf): returns a boolean indicating if all elements of a set are in a specific set.

返回 A 是否包含于 B，即 B 包含 A
<img class="set-diagram" src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHN0eWxlPi5zdDB7ZmlsbDpub25lO3N0cm9rZTojMjMxZjIwO3N0cm9rZS1taXRlcmxpbWl0OjEwfTwvc3R5bGU+PGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMTUwIiBjeT0iMTAwIiByPSI3NSIvPjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNTAiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQuMzYxIDk0LjUxKSI+QTwvdGV4dD48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQuMzU4IDQ0LjUxKSI+QjwvdGV4dD48L3N2Zz4=" />

- [`isSupersetOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSupersetOf): returns a boolean indicating if all elements of a set are in a specific set.

返回 A 是否包含 B
<img class="set-diagram" src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHN0eWxlPi5zdDB7ZmlsbDpub25lO3N0cm9rZTojMjMxZjIwO3N0cm9rZS1taXRlcmxpbWl0OjEwfTwvc3R5bGU+PGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMTUwIiBjeT0iMTAwIiByPSI3NSIvPjxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNTAiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQuMzU4IDQ0LjUxKSI+QTwvdGV4dD48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDQuMzYxIDk0LjUxKSI+QjwvdGV4dD48L3N2Zz4=" />

- [`isDisjointFrom()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isDisjointFrom): returns a boolean indicating if this set has no elements in common with a specific set.

返回 A 是否与 B 互斥
<img class="set-diagram" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48c3R5bGU+LnN0MHtmaWxsOm5vbmU7c3Ryb2tlOiMyMzFmMjA7c3Ryb2tlLW1pdGVybGltaXQ6MTB9PC9zdHlsZT48Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSI5MCIgY3k9IjEwMCIgcj0iNTAiLz48Y2lyY2xlIGNsYXNzPSJzdDAiIGN4PSIyMTAiIGN5PSIxMDAiIHI9IjUwIi8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoODUuOTk2IDYzLjIpIj5BPC90ZXh0Pjx0ZXh0IHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwNS45OTggNjMuMikiPkI8L3RleHQ+PC9zdmc+" />

## 兼容性

[caniuse](https://caniuse.com/?search=Set.intersection)

考虑兼容低版本浏览器，需引入 [polyfill](https://github.com/zloirock/core-js?tab=readme-ov-file#set)

<style>
.set-diagram {
  width: auto;
  height: 100px;
}
</style>
