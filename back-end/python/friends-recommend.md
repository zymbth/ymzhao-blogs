---
description: python实现用户好友推荐
head:
  - - meta
    - name: keywords
      content: python,好友推荐
created: '2020-01-02'
---

# python实现用户好友推荐

如果能获取通讯录权限，可通过用户通讯录推荐

这里仅简单得根据与用户的共同好友数推荐

代码如下：

```python
import pymongo
import random


class Mongodb(object):
    def __init__(self, host, port, db):
        try:
            my_client = pymongo.MongoClient(host + ':' + port)
        except Exception:
            raise Exception('Cannot connect to server')
        else:
            self.db_ais = my_client[db]


class UsersRecommend:
    def __init__(self, uuid):
        self.uuid = uuid
        self.my_db = Mongodb('mongodb://localhost', 'xxxxx', 'xxx')  # 连接数据库，可用mysql
        self.res_data = list(self.my_db.db_ais['friends'].find({'status': {'$in': [2, -1]}}, {'toUserId': 1, 'userId': 1}))  # 查询所有用户好友关系表
        self.direct_f = self.get_friends(uuid)  # 用户好友
        if len(self.direct_f) > 50:  # 好友过多时取随机50个
            self.direct_f = random.sample(self.direct_f, 50)

    def recommend_f(self, pageno, pagesize):
        if len(self.direct_f) > 0:
            indirect_f = [{'indirect_id': x, 'relations': []} for x in self.direct_f]  # 间接好友初始化
            for x in self.res_data:  # 遍历res_data, 统计间接好友的好友列表
                if x['userId'] in self.direct_f and x['toUserId'] not in self.direct_f and x['toUserId'] != self.uuid:
                    indirect_f[self.direct_f.index(x['userId'])]['relations'].append(x['toUserId'])
            recommends, recommends_idx = [], []
            for x in indirect_f:
                if len(x['relations']) > 50:  # 跳过直接好友中好友过多的
                    continue
                for y in x['relations']:
                    if y not in recommends_idx:
                        recommends_idx.append(y)
                        recommends.append({'uid': y, 'num': 0, 'score': 0})
                    recommends[recommends_idx.index(y)]['score'] += 1  # 可惩罚‘过热’用户
                    recommends[recommends_idx.index(y)]['num'] += 1
            recommends.sort(key=lambda x: x['score'], reverse=True)  # 按共同好友数排序
            return [{'uid': x['uid'], 'common_friends': x['num']} for x in recommends][(pageno - 1) * pagesize:pageno * pagesize]  # 分页
        else:  # 用户尚未添加一个好友
            return []

    # 获取指定用户的好友列表
    def get_friends(self, usr_id):
        return [x['toUserId'] for x in self.res_data if x['userId'] == usr_id]


# 调试
# res = UserRecommend(10073926).recommend_f(1, 10)
# print(res)
```

demo里相似度计算用共同好友数代替了。

对与共同好友，可根据其好友数计算其score，然后得到相似度，根据相似度排序。具体可参考这篇博文：[好友推荐算法-基于关系的推荐](https://blog.csdn.net/qq_14950717/article/details/52197565)
