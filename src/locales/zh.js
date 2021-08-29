export default {
  locale: {
    flatpickr: 'zh',
    datepicker: 'zh-CN',
    mavonEditor: 'zh'
  },
  nav: {
    home: '首页',
    user: '用户',
    category: '分类',
    post: '文章',
    navigation: '导航',
    setting: '设置',
    log: '日志'
  },
  menu: {
    profile: '个人设置',
    signOut: '退出登录'
  },
  uploader: {
    upload: '上传',
    browse: '浏览',
    placeholder: '选择文件或拖到这里……',
    dropPlaceholder: '拖动文件到这里……',
    uploadTips: '上传成功。'
  },
  common: {
    action: '操作',
    view: '查看',
    edit: '编辑',
    del: '删除',
    refresh: '刷新',
    new: '新建',
    upload: '上传',
    ok: '好',
    cancel: '取消',
    save: '保存',
    close: '关闭',
    yes: '是',
    no: '否',
    unknown: '(未知)',
    paginationInfo: '每页{limit}条记录，共{total}条记录',
    delTips: '删除该记录？',
    incorrectTips: '输入有误，请重新确认。',
    updateTips: '记录更新成功。',
    createTips: '记录创建成功。',
    deleteTips: '记录删除成功。',
    required: '-- 必填 --',
    lenFeedback: '长度在{min}和{max}之间。',
    leaveTips: '您确认要在更改未保存的情况下离开此页面吗？'
  },
  setting: {
    id: 'ID',
    settingKey: '键',
    settingValue: '值',
    settingTag: '标记',
    isPublic: '公开',
    createdAt: '创建时间',
    updatedAt: '修改时间'
  },
  navigation: {
    id: 'ID',
    label: '标签',
    url: 'URL',
    target: '目标',
    position: '位置',
    isActive: '激活',
    createdAt: '创建时间',
    updatedAt: '修改时间',
    targets: {
      blank: '新建窗口',
      self: '当前窗口'
    }
  },
  user: {
    id: 'ID',
    username: '用户名',
    password: '密码',
    nickname: '昵称',
    email: '邮箱',
    phone: '电话',
    tags: '标记',
    introduction: '介绍',
    isActive: '激活',
    activeAt: '激活时间',
    avatar: '头像',
    gender: '性别',
    birthday: '生日',
    role: '角色',
    createdAt: '创建时间',
    updatedAt: '修改时间',
    genders: {
      male: '男',
      female: '女'
    },
    roles: {
      admin: '管理员',
      author: '作者'
    },
    resetPassword: '重置密码'
  },
  category: {
    id: 'ID',
    categoryName: '分类名称',
    keywords: '关键词',
    description: '描述',
    cover: '封面',
    route: '路由',
    isPrivate: '私有',
    createdAt: '创建时间',
    updatedAt: '修改时间'
  },
  post: {
    id: 'ID',
    uniqueId: '唯一ID',
    title: '标题',
    keywords: '关键词',
    description: '描述',
    userId: '用户',
    categoryId: '分类',
    cover: '封面',
    sourceType: '源类型',
    summary: '概要',
    route: '路由',
    isPublished: '发布',
    publishedAt: '发布时间',
    postStatistics: '统计',
    isPrivate: '私有',
    password: '密码',
    isCommentEnabled: '允许评论',
    isCommentShown: '显示评论',
    createdAt: '创建时间',
    updatedAt: '修改时间',
    write: '写作',
    comment: '评论'
  },
  postStatistics: {
    id: 'ID',
    uniqueId: '唯一ID',
    pageView: '阅读量',
    thumbUp: '点赞量',
    thumbDown: '点踩量'
  },
  comment: {
    id: 'ID',
    level: '层级',
    parentId: '父级 ID',
    nickname: '昵称',
    email: '邮箱',
    ip: 'IP',
    userAgent: '用户代理',
    content: '内容',
    commentedAt: '评论时间',
    isBlocked: '屏蔽',
    userId: '用户 ID',
    createdAt: '创建时间',
    updatedAt: '修改时间',
    reply: '回复',
    block: '屏蔽',
    unblock: '取消屏蔽'
  },
  writing: {
    save: '保存',
    editorPlaceholder: '开始写作……',
    saveTips: '保存成功。'
  },
  login: {
    username: '用户名',
    password: '密码',
    login: '登录',
    register: '注册'
  },
  register: {
    username: '用户名',
    password: '密码',
    retypePassword: '确认密码',
    nickname: '昵称',
    email: '邮箱',
    phone: '电话',
    gender: '性别',
    birthday: '生日',
    inviteCode: '邀请码',
    register: '注册',
    login: '回到登录',
    success: '注册成功，3秒后跳转到登录。'
  }
}
