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
// 信息管理-企业基础信息-企业类型
export const companyRoleOption = {
  list: [
    {
      label: '班线客运企业',
      value: 1
    },
    {
      label: '农村客运企业',
      value: 2
    },
    {
      label: '旅游客运企业',
      value: 3
    },
    {
      label: '危险品运输企业',
      value: 4
    },
    {
      label: '普通货运企业',
      value: 5
    },
    {
      label: '个体户',
      value: 6
    },
    {
      label: '公交',
      value: 7
    },
    {
      label: '出租',
      value: 8
    },
    {
      label: '其他',
      value: 9
    }
  ],
  map: {
    1: '班线客运企业',
    2: '农村客运企业',
    3: '旅游客运企业',
    4: '危险品运输企业',
    5: '普通货运企业',
    6: '个体户',
    7: '公交',
    8: '出租',
    9: '其他'
  }
}
export const companyStatusOption = {
  list: [
    {
      label: '全部',
      value: 1
    },
    {
      label: '营运',
      value: 2
    },
    {
      label: '歇业',
      value: 3
    }
  ],
  map: {
    0: '营运',
    1: '歇业'
  }
}
export const companyLevel = {
  list: [
    {
      label: '总公司',
      value: 1
    },
    {
      label: '子公司',
      value: 2
    }
  ],
  map: {
    1: '总公司',
    2: '子公司'
  }
}
export const companyEconomy = {
  list: [
    {
      label: '集体',
      value: 0
    },
    {
      label: '合资',
      value: 1
    }
  ],
  map: {
    0: '总公司',
    1: '子公司'
  }
}

// 服务车辆类型
export const serviceCarKinds = {
  list: [
    {
      label: '全部',
      value: '1'
    },
    {
      label: '班线客运',
      value: '2'
    },
    {
      label: '旅游客运',
      value: '3'
    },
    {
      label: '包车客运',
      value: '4'
    },
    {
      label: '农村客运',
      value: '5'
    },
    {
      label: '普通货车',
      value: '6'
    },
    {
      label: '重型货车',
      value: '7'
    },
    {
      label: '危险品运输车辆',
      value: '8'
    }
  ]
}

// 接入平台性质
export const accessPlatformBelong = {
  list: [
    {
      label: '全部',
      value: '1'
    },
    {
      label: '经营性',
      value: '2'
    },
    {
      label: '非经营性',
      value: '3'
    }
  ]
}

// 接入平台类型
export const accessPlatformKinds = {
  list: [
    {
      label: '全部',
      value: ''
    },
    {
      label: '企业监控平台',
      value: ''
    },
    {
      label: '政府监管平台',
      value: ''
    }
  ]
}

// 平台支持功能
export const platformSupportFeatures = {
  list: [
    {
      label: '全部',
      value: ''
    },
    {
      label: '行驶记录仪',
      value: ''
    },
    {
      label: '视频监控',
      value: ''
    },
    {
      label: '高级驾驶辅助系统ADAS',
      value: ''
    },
    {
      label: '驾驶员状态监测系统LKP',
      value: ''
    },
    {
      label: '胎压监测系统TPMS',
      value: ''
    }
  ]
}

// 服务地区范围
export const serviceArea = {
  list: [
    {
      label: '成都市',
      value: ''
    },
    {
      label: '自贡市',
      value: ''
    },
    {
      label: '攀枝花市',
      value: ''
    },
    {
      label: '泸州市',
      value: ''
    },
    {
      label: '德阳市',
      value: ''
    },
    {
      label: '广元市',
      value: ''
    },
    {
      label: '遂宁市',
      value: ''
    },
    {
      label: '巴中市',
      value: ''
    },
    {
      label: '资阳市',
      value: ''
    },
    {
      label: '阿坝藏族羌族自治州',
      value: ''
    },
    {
      label: '甘孜藏族自治州',
      value: ''
    },
    {
      label: '凉山黎族自治州',
      value: ''
    }
  ]
}

// 平台状态
export const platformStatus = {
  list: [
    {
      label: '全部',
      value: ''
    },
    {
      label: '正常',
      value: ''
    },
    {
      label: '歇业',
      value: ''
    }
  ]
}

// 备案状态
export const recordStatus = {
  list: [
    {
      label: '全部',
      value: ''
    },
    {
      label: '已备案',
      value: ''
    },
    {
      label: '未备案',
      value: ''
    }
  ]
}
// 车辆基本信息
// 车辆基本信息-车辆类型
export const carRoleOption = {
  list: [
    {
      label: '旅游包车',
      value: 1
    },
    {
      label: '农村客运企业',
      value: 2
    },
    {
      label: '旅游客运企业',
      value: 3
    },
    {
      label: '危险品运输企业',
      value: 4
    },
    {
      label: '普通货运企业',
      value: 5
    },
    {
      label: '个体户',
      value: 6
    },
    {
      label: '公交',
      value: 7
    },
    {
      label: '出租',
      value: 8
    },
    {
      label: '其他',
      value: 9
    }
  ],
  map: {
    1: '班线客运企业',
    2: '农村客运企业',
    3: '旅游客运企业',
    4: '危险品运输企业',
    5: '普通货运企业',
    6: '个体户',
    7: '公交',
    8: '出租',
    9: '其他'
  }
}
// 车辆基本信息-运营状态
export const runStatusOption = {
  list: [
    {
      label: '旅游包车',
      value: 1
    },
    {
      label: '农村客运企业',
      value: 2
    },
    {
      label: '旅游客运企业',
      value: 3
    },
    {
      label: '危险品运输企业',
      value: 4
    },
    {
      label: '普通货运企业',
      value: 5
    },
    {
      label: '个体户',
      value: 6
    },
    {
      label: '公交',
      value: 7
    },
    {
      label: '出租',
      value: 8
    },
    {
      label: '其他',
      value: 9
    }
  ],
  map: {
    1: '班线客运企业',
    2: '农村客运企业',
    3: '旅游客运企业',
    4: '危险品运输企业',
    5: '普通货运企业',
    6: '个体户',
    7: '公交',
    8: '出租',
    9: '其他'
  }
}
// 车辆基本信息-单双驾
export const doubleStatusOption = {
  list: [
    {
      label: '单驾',
      value: 1
    },
    {
      label: '双驾',
      value: 2
    }
  ],
  map: {
    1: '单驾',
    2: '双驾 '
  }
}

// 驾驶员基本信息-从业资格范围
export const qualificationRangeOption = {
  list: [
    {
      label: '道路旅客运输',
      value: '1'
    },
    {
      label: '道路货物运输',
      value: '2'
    },
    {
      label: '道路危险品运输',
      value: '3'
    }
  ]
}

// 驾驶员基本信息-状态
export const driverStatusOption = {
  list: [
    {
      label: '从业',
      value: '1'
    },
    {
      label: '待业',
      value: '2'
    },
    {
      label: '注销',
      value: '3'
    }
  ]
}

// 驾驶员基本信息-文化程度
export const cultureOptions = {
  list: [
    {
      label: '初中',
      value: '1'
    },
    {
      label: '高中',
      value: '2'
    },
    {
      label: '大学',
      value: '3'
    },
    {
      label: '其他',
      value: '4'
    }
  ]
}

// 驾驶员基本信息-准驾车型
export const driverVelTyeOptions = {
  list: [
    {
      label: 'A1',
      value: '1'
    },
    {
      label: 'A2',
      value: '2'
    },
    {
      label: 'A3',
      value: '3'
    },
    {
      label: 'B1',
      value: '4'
    },
    {
      label: 'B2',
      value: '5'
    },
    {
      label: 'C1',
      value: '6'
    },
    {
      label: 'C2',
      value: '7'
    }
  ]
}
