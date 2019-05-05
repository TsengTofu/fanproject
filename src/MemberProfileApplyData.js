// 會員曾經填寫過的資料
import React from 'react'
import { connect } from 'react-redux'
// 組件

// action
import { deleteUserApplyData } from './store/actions/GetUserFormDataAction'

// css part
import './MemberProfileApplyData.css'

class MemberProfileApplyData extends React.Component {
    constructor(props) {
        super(props);
    }

    // 刪除交換文件的功能
    handleDelete(e) {
        e.preventDefault();
        let deleteApply = e.currentTarget.getAttribute("data-docid");
        alert('申請文件已刪除');
        this.props.deleteUserApplyData(deleteApply);
    }

    render() {
        // 可以抓到父層的資料 在父層插入的子組件要記得寫data={this.props} const這層宣告一定要寫
        const { data } = this.props;
        console.log(typeof (data.memberFormData));
        const info = data.memberFormData && data.memberFormData.map((item, index) => {
            let itemData = item.match_User_DocData;
            let itemDocID = item.match_User_DocID;
            // 交換狀態的資料顯示 
            let exChangeStatus = itemData.initialChangeState;
            if (exChangeStatus === 0) { exChangeStatus = '等待有緣人交換' }
            else if (exChangeStatus === 1) {
                exChangeStatus = '等待回應'
            } else if (exChangeStatus === 2) {
                exChangeStatus = '已結案'
            } else {
                exChangeStatus = '拒絕'
            }
            // 交換方式要轉換成中文
            let exChangeWay = itemData.changeWay;
            if (exChangeWay === 'send_package') { exChangeWay = '郵寄' }
            else if (exChangeWay === 'face_to_face') {
                exChangeWay = '面交'
            } else {
                exChangeWay = '其他'
            }

            return (
                <li key={itemDocID} className="user_apply_data_block">
                    <div className="apply_image">
                        <img src={itemData.url} />
                    </div>
                    <div className="concert_place_exchange_info">
                        <h4>{itemData.ConcertName}</h4>
                        <p className="exchangeWay">
                            {exChangeWay}｜{exChangeStatus}
                        </p>
                        <p className="">交換 {itemData.exChangeSelectArea + ' ' + itemData.exChangeSelectPrice}</p>
                        <p className="">持有 {itemData.selectName + ' ' + itemData.selectPrice}</p>
                    </div>
                    <p className="reminder_txt">
                        <i className="fas fa-comment-dots"></i> {itemData.reminderTxt}
                    </p>
                    {
                        itemData.initialChangeState !== 2 &&
                        <div className="bottom_buttons">
                            <button className="deleteThisApply"
                                onClick={this.handleDelete.bind(this)}
                                data-docid={itemDocID}>
                                <i className="fas fa-times"></i> 刪除
                            </button>
                            <button className="searchAgain">
                            <i className="fas fa-search"></i> 搜尋
                            </button>
                        </div> 
                        || itemData.initialChangeState === 2 &&
                        <div className="bottom_buttons">
                            <p>已結案</p>
                        </div> 
                    }
                </li>
            )
        })
        return (
            <div className="apply_data_all">
                <h3 className="profile_title">填寫交換申請紀錄</h3>
                <div className="border_decoration"></div>
                <div className="member_apply_data_block">
                    <ul>
                        {info}
                    </ul>
                </div>
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return ({
        deleteUserApplyData: (deleteApply) => dispatch(deleteUserApplyData(deleteApply))
    })
}

export default connect(
    null,
    mapDispatchToProps)(MemberProfileApplyData);

