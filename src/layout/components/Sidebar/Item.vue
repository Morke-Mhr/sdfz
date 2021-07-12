<script>
const paths = [
  //工作任务
  {
    path: '/task',
    icon: 'icon-renwu'
  },
  //岗位职责
  {
    path: '/response',
    icon: 'icon-xiangmutuijin'
  },
  //隐患排查
  {
    path: '/hiddendanger',
    icon: 'icon-yinhuanxinxi-'
  },
  //安全教育
  {
    path: '/safetyEdu',
    icon: 'icon-anquan'
  },
  //法规标准
  {
    path: '/standard',
    icon: 'icon-falvsusong'
  },
  //安全考核
  {
    path: '/assess',
    icon: 'icon-shequkaohe'
  },
  //设置安全技术
  {
    path: '/assess',
    icon: 'icon-anquan'
  },
  //系统管理
  {
    path: '/system',
    icon: 'icon-xitongshezhi'
  },
  //特种设备
  {
    path: '/equipment',
    icon: 'icon-shebei'
  },
  //应急事故
  {
    path: '/accident',
    icon: 'icon-UI_icon_shigu'
  }
]

function isAlibbIcon(icon, path) {
  // console.log(path);
  let alibbIcon = null
  paths.filter((item) => {
    let thisPath = item.path
    if (thisPath === path) {
      alibbIcon = item
      return true
    }
  })
  if (alibbIcon) {
    return 'iconfont-org ' + alibbIcon.icon
  } else {
    return 'el-icon-' + icon
  }
}

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, path } = context.props
    const vnodes = []

    if (icon) {
      //<i :class="'el-icon-' + item" />
      // vnodes.push(<svg-icon icon-class={icon}/>)
      let el = isAlibbIcon(icon, path)

      vnodes.push(<i class={el} />)
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>)
    }
    return vnodes
  }
}
</script>
