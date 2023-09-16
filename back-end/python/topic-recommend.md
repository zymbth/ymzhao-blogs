# python 基于 item-item filtering 实现话题推荐

itemCF 计算 item 间的相似度，生成相似度矩阵。然后根据输入 items 计算最相似的 items。

以用户与话题为例，为用户推荐话题。

首先获取话题列表，其次根据用户与话题的交互（评论、点赞）统计每个用户的话题列表。

然后倒排出话题相似度矩阵

```python
import numpy as np


class TopicsRecommend:
    def __init__(self, uuid):
        self.uuid = uuid
        self.mysql_t = ...  # 连接数据库
        self.usr_topics = []
        self.all_topics = []

	def get_similarity_matrix(self):
		self.all_topics = [...]  # 生成item列表
		self.usr_topics = [...]  # {'usr_id': xx, 'topics': []} 生成记录每个用户的用户话题列表
		C = np.zeros((len(self.all_topics), len(self.all_topics)), dtype=float)  # items之间的相似度矩阵
		for usr_tps in self.usr_topics:
			for comb in itertools.combinations(self.usr_tps['topics'], 2):  # 倒排
				tp1, tp2 = comb[0], comb[1]
				if tp1 in self.all_topics and tp2 in self.all_topics:  # 曾参与过的话题可能已失效而不在all_topics之列
					C[self.all_topics.index(tp1)][self.all_topics.index(tp2)] += 1  # 可更改计算方法
		C += np.transpose(C)
		return C

	def recommend_topics(self):
	    simi_matrix = self.get_similarity_matrix()
	    if len(simi_matrix) > 0:
	        tp_scores = np.zeros(len(self.all_topics), dtype=float)
	        for tp in self.usr_topics:
	            if tp in self.all_topics:
	                temp_tps = list(simi_matrix[self.all_topics.index(tp)])
	                tp_scores = [tp_scores[i]+temp_tps[i] for i in range(0, len(self.all_topics))]
	        score_sum = list(enumerate(tp_scores))
	        score_sum.sort(key=lambda x: x[1], reverse=True)
	        return [self.all_topics[x[0]] for k, x in enumerate(score_sum) if k < 10]
	    else:  # 返回最新话题
	        return self.all_topics[:10]


# 调试
# res = TopicsRecommend('xxx').recommend_topics()
# print(res)
```

请注意 itemCF 与 userCF 的区别，采用合适的推荐系统
