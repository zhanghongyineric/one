/*
  维护全局的映射关系和下拉选项
*/

// 颜色
export const colors = {
  red: '#ee6666',
  yellow: '#fac858',
  blue: '#409EFF',
  green: '#91cc75'
}

// 账号状态
export const statusOption = {
  list: [
    {
      label: '停用',
      value: 0
    },
    {
      label: '启用',
      value: 1
    }

  ],
  map: {
    0: '已禁用',
    1: '已生效'
  }
}

// 车辆在线状态
export const statusOption1 = {
  list: [
    {
      label: '停用',
      value: 0
    },
    {
      label: '启用',
      value: 1
    }

  ],
  map: {
    0: '不在线',
    1: '在线'
  }
}

export const statusOption2 = {
  list: [
    {
      label: '其他',
      value: 0
    },
    {
      label: '黄牌',
      value: 1
    },
    {
      label: '蓝牌',
      value: 2
    },
    {
      label: '黑牌',
      value: 3
    },
    {
      label: '白牌',
      value: 4
    }

  ],
  map: {
    0: '其他',
    1: '黄牌',
    2: '蓝牌',
    3: '黑牌',
    4: '白牌'
  }
}

// 账号类别
export const roleOption = {
  list: [
    {
      label: '管理员',
      value: 'admin'
    },
    {
      label: '政府',
      value: 'gov'
    },
    {
      label: '企业',
      value: 'unit'
    }

  ],
  listNoUnit: [
    {
      label: '管理员',
      value: 'admin'
    },
    {
      label: '政府',
      value: 'gov'
    }
  ],
  map: {
    admin: '管理员',
    gov: '政府',
    unit: '企业'
  }
}

// 违章程度
export const violationOption = {
  list: [
    {
      label: '轻微违章',
      value: 2
    },
    {
      label: '一般违章',
      value: 1
    },
    {
      label: '严重违章',
      value: 0
    }
  ],
  map: {
    0: '严重违章',
    1: '一般违章',
    2: '轻微违章'
  }
}

// 违规记录状态
export const violationStatusOption = {
  list: [
    {
      label: '未处理',
      value: 0
    },
    {
      label: '已处理',
      value: 1
    }
  ],
  map: {
    0: '未处理',
    1: '已处理'
  }
}

// 违规类型
export const violationTypeOption = {
  list: [
    {
      label: 'ADAS',
      value: 0
    },
    {
      label: 'DSM',
      value: 1
    },
    {
      label: '超速行驶',
      value: 2
    },
    {
      label: '疲劳驾驶',
      value: 3
    },
    {
      label: '脱离监管',
      value: 4
    },
    {
      label: '运营违规',
      value: 5
    }
  ],
  map: {
    0: 'ADAS',
    1: 'DSM',
    2: '超速行驶',
    3: '疲劳驾驶',
    4: '脱离监管',
    5: '运营违规'
  }
}

// 安全码颜色
// 安全码的颜色选择 1 代表绿 2 代表蓝色 3代表黄色 4 代表 红色
export const colorOption = {
  list: [
    {
      label: '红码',
      value: 4,
      min: 0,
      max: 59,
      color: colors.red
    },
    {
      label: '黄码',
      value: 3,
      min: 60,
      max: 79,
      color: colors.yellow
    },
    {
      label: '蓝码',
      value: 2,
      min: 80,
      max: 89,
      color: colors.blue
    },
    {
      label: '绿码',
      value: 1,
      min: 90,
      max: 100,
      color: colors.green
    }
  ],
  map: {
    1: '绿码',
    2: '蓝码',
    3: '黄码',
    4: '红码'
  },
  mapColor: {
    1: colors.green,
    2: colors.blue,
    3: colors.yellow,
    4: colors.red
  }
}

// 企业分类
export const companyTypeOption = {
  list: [
    {
      label: '全部企业',
      value: 0
    },
    {
      label: '危险品运输企业',
      value: 1
    },
    {
      label: '旅游客运企业',
      value: 2
    },
    {
      label: '三类以上班运企业',
      value: 3
    }
  ],
  map: {
    0: '全部企业',
    1: '危险品运输企业',
    2: '已处理',
    3: '三类以上班运企业'
  }
}

// 车牌类型
export const carCategare = {
  list: [
    {
      label: '其他',
      value: 0
    },
    {
      label: '黄牌',
      value: 1
    },
    {
      label: '蓝牌',
      value: 2
    },
    {
      label: '黑牌',
      value: 3
    },
    {
      label: '白牌',
      value: 4
    }
  ],
  map: {
    0: '其他',
    1: '黄牌',
    2: '蓝牌',
    3: '黑牌',
    4: '白牌'
  }
}

// 车辆类型
export const carCategare1 = {
  list: [
    {
      label: '无',
      value: 0
    },
    {
      label: '危险品运输车',
      value: 1
    },
    {
      label: '普通客运车辆',
      value: 2
    },
    {
      label: '农村客运车辆',
      value: 3
    },
    {
      label: '出租车',
      value: 4
    }
  ],
  map: {
    0: '无',
    1: '危险品运输车',
    2: '普通客运车辆',
    3: '农村客运车辆',
    4: '出租车'
  }
}

// 企业风险类别分类
export const companySafeLevelOption = {
  list: [
    {
      label: '安全信任企业',
      value: 1
    },
    {
      label: '一般风险企业',
      value: 2
    },
    {
      label: '较高风险企业',
      value: 3
    },
    {
      label: '高风险企业',
      value: 4
    }
  ],
  map: {
    '1': {
      text: '安全信任企业',
      color: colors.green
    },
    '2': {
      text: '一般风险企业',
      color: colors.blue
    },
    '3': {
      text: '较高风险企业',
      color: colors.yellow
    },
    '4': {
      text: '高风险企业',
      color: colors.red
    }

  }
}

// 安全码申请状态
export const applyStatus = {
  list: [
    {
      label: '全部',
      value: '0,1'
    },
    {
      label: '成功',
      value: '0'
    },
    {
      label: '失败',
      value: '1'
    }
  ]
}

// 扣分申诉申请状态
export const penaltyAppealStatus = {
  list: [
    {
      label: '全部',
      value: '0,1,2,3'
    },
    {
      label: '申诉中',
      value: '0'
    },
    {
      label: '申诉通过',
      value: '1'
    },
    {
      label: '申诉无效',
      value: '2'
    }
  ]
}

// 驾驶员安全码状态
export const driverSafecode = {
  list: [
    {
      label: '红码',
      value: '4'
    },
    {
      label: '黄码',
      value: '3'
    },
    {
      label: '蓝码',
      value: '2'
    },
    {
      label: '绿码',
      value: '1'
    }
  ]
}
