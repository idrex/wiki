/**
 * 永远只比较同层节点，不会跨层级比较节点。
 * 不同的两个节点产生不同的树。这也就是上面总结的类型不相同的情况，把原来的节点以及它的后代全部干掉，替换成新的。
 * 通过 key 值指定哪些元素是相同的。
 */