// 正式项目
import Dashboard from './dashboard/Dashboard';
import Column from './column/Column';

// 推广管理
import SearchTerms from './marketing/SearchTerms';
import AddSeeker from './marketing/children/AddSeeker';
import Resource from './marketing/Resource';
import Advertising from './marketing/children/Advertising';
import Banners from './marketing/Banners';
import AddBanner from './marketing/children/AddBanner';
import Doufu from './marketing/Doufu';
import AddDoufu from './marketing/children/AddDoufu'
import ActivityDialog from './marketing/ActivityDialog';
import AddActivityDialog from './marketing/children/AddActivityDialog'
import HomePit from './marketing/HomePit'
import AddHomePit from './marketing/children/AddHomePit'
import BottomMsg from './marketing/BottomMsg'   
import AddBottom from './marketing/children/AddBottom'


import MessageCenter from './messageCenter/MessageCenter';
import Users from './users/Users';
import Earnings from './earnings/Earnings';
import Withdraw from './withdraw/Withdraw';
import Logistics from './logistics/Logistics';
import SafetyAndSetting from './safetyAndSetting/SafetyAndSetting';

// 订单管理
import Orders from './orders/Orders';
import AddOrder from './orders/children/AddOrder';
import Safeguard from './orders/Safeguard'
import PromptlyOrder from './orders/children/PromptlyOrder'
import ScalpingOrder from './orders/ScalpingOrder'
import ViewCalpingDetail from './orders/children/ViewCalpingDetail'
import ScalpingOrder4 from './orders/ScalpingOrder4.0'
import ViewCalpingDetail4 from './orders/children/ViewCalpingDetail4.0'

// 商品管理
import AttractGoods from './commodity/AttractGoods';
import AddAttractGoods from './commodity/children/AddAttractGoods';
import OperateGoods from './commodity/OperateGoods';
import AddOperateGoods from './commodity/children/AddOperateGoods';
import SettleAttractGoods from './commodity/children/SettleAttractGoods'
import ScalpingGoods from './commodity/ScalpingGoods'
import AddScalpingGoods from './commodity/children/AddScalpingGoods'
import ScalpingGoods4 from './commodity/ScalpingGoods4.0'
import AddScalpingGoods4 from './commodity/children/AddScalpingGoods4.0'

//活动专场管理
import SpecialManagement from './activityField/field/SpecialManagement';
import AddManagement from './activityField/children/AddManagement';
import SpecialMerchandise from './activityField/field/SpecialMerchandise';
import AddGoods from './activityField/children/AddGoods';
import EditGoods from './activityField/children/EditGoods';
// 分享管理
import RecommendGoods from './share/RecommendGoods';
import AddRecommendGoods from './share/children/AddRecommendGoods';
import MaterialGoods from './share/MaterialGoods';
import AddMaterial from './share/children/AddMaterial';
// 会员模板后台
import AddLink from './member/children/AddLink';
import LinkList from './member/LinkList';
import Event from './activityField/Event';
import AddEvent from './activityField/children/AddEvent';
// 布局配置
import Tile from './tile/Tile';
import AddTile from './tile/children/AddTile';
import TileTest from './tile/TileTest';
import Message from './tile/Message';
import AddMessageStyle from './tile/children/AddMessageStyle';
import GoodsSpecial from './tile/GoodsSpecial';
import AddGoodsSpecial from './tile/children/AddGoodsSpecial';
import Video from './tile/Video';
import AddVideo from './tile/children/AddVideo';
import FreeCharge from './tile/FreeCharge';
import AddFreeCharge from './tile/children/AddFreeCharge';
import Todaypush from './tile/Todaypush';
import AddTodayPush from './tile/children/AddTodayPush';
// 应用配置
import FootNav from './application/FootNav';
import AddFootNav from './application/children/AddFootNav';
import Notice from './application/Notice';
import AddNotice from './application/children/AddNotice';
import mine from './application/mine';
import entryManagement from './application/entryManagement';
import addMine from './application/children/addMine';
import AddManagment from './application/children/AddManagment';
import poster from './application/Poster';
import AddPoster from './application/children/AddPoster';
import Version from './application/Version';
import AddVersion from './application/children/AddVersion';
// 选品库
import MyChooseLib from './chooseLib/MyChooseLib'
import ChooseGoodsLib from './chooseLib/children/ChooseGoodsLib'
import ChooseRuleLib from './chooseLib/children/ChooseRuleLib'
import SetGoodsLib from './chooseLib/children/SetGoodsLib'
import SetRuleLib from './chooseLib/children/SetRuleLib'
import HrzSalesList from './chooseLib/HrzSalesList'
import HaodankuList from './chooseLib/HaodankuList'
//组合会场
import AssemblyHall from './activityField/AssemblyHall'
import AssBanner from './activityField/AssBanner'
import AddHall from './activityField/children/AddHall'
import AddBannerContent from './activityField/children/AddBanner'
import ThemeGoods from './activityField/ThemeGoods'
import AddTheme from './activityField/children/AddTheme'
import Imgcom from './activityField/Imgcom'
import AddImg from './activityField/children/AddImg'

//建议及投诉
import Proposal from './proposal/proposal'

export default {
    Proposal,
    Imgcom,
    AddImg,
    AddTheme,
    ThemeGoods,
    AddBannerContent,
    AssBanner,
    AddHall,
    AssemblyHall,
    Version,
    AddVersion,
    poster,
    AddPoster, 
    AddManagment,
    entryManagement,
    mine,
    addMine,
    EditGoods,
    AddGoods, 
    SpecialMerchandise,
    SpecialManagement,
    AddManagement,
    Dashboard,
    Orders,
    Column,
    SearchTerms,
    AddSeeker,
    Resource,
    AddMaterial,
    Advertising,
    Banners,
    AddBanner,
    Doufu,
    AddDoufu,
    ActivityDialog,
    AddActivityDialog,
    MessageCenter,
    Users,
    Earnings,
    Withdraw,
    Logistics,
    SafetyAndSetting,
    Safeguard,
    AddOrder,
    AttractGoods,
    AddAttractGoods,
    ScalpingGoods4,
    AddScalpingGoods4,
    OperateGoods,
    AddOperateGoods,
    SettleAttractGoods,
    ScalpingGoods,
    AddScalpingGoods,
    PromptlyOrder,
    ScalpingOrder,
    ScalpingOrder4,
    ViewCalpingDetail4,
    ViewCalpingDetail,
    RecommendGoods,
    MaterialGoods,
    AddRecommendGoods,
    AddLink,
    LinkList,
    Event,
    AddEvent,
    FootNav,
    Notice,
    AddFootNav,
    AddNotice,
    Tile,
    AddTile,
    TileTest,
    Message,
    AddMessageStyle,
    GoodsSpecial,
    AddGoodsSpecial,
    Video,
    AddVideo,
    FreeCharge,
    AddFreeCharge,
    Todaypush,
    AddTodayPush,
    HomePit,
    AddHomePit,
    MyChooseLib,
    ChooseGoodsLib,
    ChooseRuleLib,
    SetGoodsLib,
    SetRuleLib,
    HrzSalesList,
    HaodankuList,
    BottomMsg,
    AddBottom
}
