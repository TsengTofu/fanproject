// 在會員頁面上點選申請交換Action
// exChangeApplyBtn 填完表單 > 搜索 > render表單的交換按鈕
// 抓到彼此的 UID (user_id) + DOC ID + 該文件的交換狀態 initialChangeState
// 傳到 firestore (因為確定都是存在的 所以不用判斷是否存在)
// 因為每一張票都會有申請人 票券DOC ID = 集合裡面的DOC ID
// 裡面放陣列抓到提出申請的人的ID 還有 DOC ID 

export const exChangeApplyBtn = (applyData, DecideData) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // const firebase = getFirebase();
        const firestore = getFirestore();
        if (applyData.applySearch_docID) {
            let apply = [];
            let applyuserID = applyData.applySearch_userID;
            let applydocID = applyData.applySearch_docID;
            let deciderDocID = DecideData.deciderDocID;
            // 申請的文件，把狀態改成 1
            firestore.collection('exchange_form').doc(`${applydocID}`).update({ initialChangeState: 1 })
            firestore.collection('ApplicationForm_context').doc(`${deciderDocID}`).get().then(docSnapshot => {
                // 先試試看擺在這裡
                if (docSnapshot.exists) {
                    firestore.collection('ApplicationForm_context').doc(`${deciderDocID}`).update({
                        apply: firestore.FieldValue.arrayUnion({ Apply_userID: applyuserID, Apply_docID: applydocID })
                    }).then(() => {
                        dispatch({ type: 'CREATE_APPLY_DATA_BOTH_USER', apply, DecideData })
                    })
                } else {
                    // apply.push(applyData)
                    firestore.collection('ApplicationForm_context').doc(`${deciderDocID}`).set({
                        apply: `${apply.push(applyData)}`,
                        ...DecideData
                    }).then(() => {
                        dispatch({ type: 'CREATE_APPLY_DATA_BOTH_USER', apply, DecideData })
                    })

                }
            })
        } else {
            let apply = [];
            let applyuserID = applyData.Apply_userID;
            let applydocID = applyData.Apply_docID;
            let deciderDocID = DecideData.deciderDocID;
            firestore.collection('exchange_form').doc(`${applydocID}`).update({ initialChangeState: 1 })
                // 如果 ApplicationForm_context 裡面的 找的到對應的 doc 就update array [] 
            firestore.collection('ApplicationForm_context').doc(`${deciderDocID}`).get().then(docSnapshot => {
                if (docSnapshot.exists) {
                    firestore.collection('ApplicationForm_context').doc(`${deciderDocID}`).update({
                        apply: firestore.FieldValue.arrayUnion({ Apply_userID: applyuserID, Apply_docID: applydocID })
                    }).then(() => {
                        dispatch({ type: 'CREATE_APPLY_DATA_BOTH_USER', apply, DecideData })
                    })
                } else {
                    apply.push(applyData);
                    firestore.collection('ApplicationForm_context').doc(`${deciderDocID}`).set({
                        apply,
                        ...DecideData
                    }).then(() => {
                        dispatch({ type: 'CREATE_APPLY_DATA_BOTH_USER', apply, DecideData })
                    })
                }
            })
        }
    }
}



// 收到申請的那方會看到的所有資料-----------------------------------------------------------------
export const getAllApplyDataToSpecificUser = (getAllApplyData) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        //const firebase = getFirebase();
        const firestore = getFirestore();
        const currentWho = getState().firebase.auth.uid;
        // 全部的資訊
        //let applyArray = [];
        let decideData = [];

        console.log(currentWho, '現在的使用者ID');
        // 現在的使用者是誰

        firestore.collection('ApplicationForm_context').where('deciderUserID', '==', `${currentWho}`).get().then(
            querySnapshot => {
                querySnapshot.forEach(doc => {
                    let matchApplyDocID = doc.id;
                    let matchApplyDocData = doc.data();
                    console.log(matchApplyDocID)
                    firestore.collection('exchange_form').doc(`${matchApplyDocID}`).get().then(
                        querySnapshot => {
                            let data = querySnapshot.data();
                            data.docID = matchApplyDocID;
                            matchApplyDocData.apply.map((items) => {
                                firestore.collection('exchange_form').doc(`${items.Apply_docID}`).get().then(
                                    querySnapshot => {
                                        if (querySnapshot.data() !== undefined) {
                                            let applydocID = querySnapshot.id;
                                            let applydocData = querySnapshot.data();
                                            applydocData.docID = applydocID;
                                            decideData.push({ data, apply: [applydocData] })
                                            dispatch({ type: 'GET_USER_APPLICATION_DATA_WAIT_RESPONSE', decideData })
                                            console.log(decideData)
                                        }
                                    }
                                )
                            })

                        }
                    )
                })

            }
        )
    }
}


// 接受或拒絕的按鈕-----------------------------------------------------------------
// 一次可以更改全部的狀態,只要按鈕被按了就要觸發
export const AgreeOrRefuseBtn = (responseResult) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        // console.log(responseResult, '回傳的資料');
        // console.log(responseResult.decideDocID, '要決定的那個文件ID');
        // console.log(responseResult.DocID, '被接受或拒絕的文件ID');
        // console.log(responseResult.Email, '被接受或拒絕的email');
        // console.log(responseResult.State, '被接受或拒絕的文件資料狀態');
        // console.log(responseResult.acceptOrRefuse, 'F 拒絕 T 同意');
        // console.log(responseResult.Reminder, '被接受或拒絕的提示文字');
        // console.log(responseResult.UserName, '被接受或拒絕的名字');

        let decideDocID = responseResult.decideDocID;
        let DocID = responseResult.DocID;
        let result = responseResult.acceptOrRefuse;

        if (result === true) {
            firestore.collection('exchange_form').doc(`${DocID}`).update({ initialChangeState: 2 })
            firestore.collection('exchange_form').doc(`${decideDocID}`).update({ initialChangeState: 2 })
        } else {
            firestore.collection('exchange_form').doc(`${DocID}`).update({ initialChangeState: 3 })
            firestore.collection('exchange_form').doc(`${decideDocID}`).update({ initialChangeState: 3 })
        }
        dispatch({ type: 'RESPONSE_TO_THE_APPLICANTS', responseResult })
    }
}