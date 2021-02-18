import {
    HomeOutlined, UnorderedListOutlined,
    ToolOutlined, AppstoreOutlined,
    UserOutlined, SafetyOutlined,
    AreaChartOutlined, BarChartOutlined,
    LineChartOutlined, PieChartOutlined,
} from '@ant-design/icons';

export const nav = [
    {
        title: '首页',
        key: '/',
        icon: <HomeOutlined />
    },
    {
        title: '商品',
        key: 'shopping',
        icon: <AppstoreOutlined />,
        children: [
            {
                title: '品类管理',
                key: '/shopping/class',
                icon: <UnorderedListOutlined />
            },
            {
                title: '商品管理',
                key: '/shopping/goods',
                icon: <ToolOutlined />
            },
        ]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: <UserOutlined />
    },
    {
        title: '角色管理',
        key: '/role',
        icon: <SafetyOutlined />
    },
    {
        title: '图形图表',
        key: 'chart',
        icon: <AreaChartOutlined />,
        children: [
            {
                title: '柱状图',
                key: '/chart/barchart',
                icon: <BarChartOutlined />
            },
            {
                title: '折现图',
                key: '/chart/linechart',
                icon: <LineChartOutlined />
            },
            {
                title: '饼状图',
                key: '/chart/piechart',
                icon: <PieChartOutlined />
            },
        ]
    },
]