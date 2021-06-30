/*
  维护全局的映射关系和下拉选项
*/

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
