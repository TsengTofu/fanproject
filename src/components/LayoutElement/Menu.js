import React from 'react'
import firebase from "../../config/firebaseConfig";
import { Link} from 'react-router-dom';
// 組件

// css part
import './Menu.css';
import logout from '../../img/svg/logout.svg'
import member from '../../img/svg/member.svg'
import logo from '../../img/svg/LOGO.svg'

class Menu extends React.Component {
	constructor(props) {
		super(props);
		this.toggleMenuActive=this.toggleMenuActive.bind(this);
		this.state={
			active:false
		}
	}

	// For Menu & mobile version menu
	toggleMenuActive(){
		const currentState = this.state.active;
		this.setState({active:!currentState});
	}

	render() {		
		return (
			<div className="wrap_menuList">
				<div className="menuList">
					<Link to='/'>
						<div className="logo_no_light">
							<img src={logo} alt=""/>
						</div>
					</Link>
					<div className="right_nav">
						<Link to='/member_profile' className="member"><div className="member_detail"><img src={member} alt=""/><p>會員</p></div></Link>						
						<Link to="/entry" className="signout"><div className="sign_out" onClick={ () => firebase.auth().signOut() }><img src={logout} alt=""/><p>登出</p></div></Link>
						<a href="#" className={this.state.active?'menu-trigger active':'menu-trigger'} onClick={this.toggleMenuActive}>
							<span></span>
							<span></span>
							<span></span>
						</a>
					</div>
				</div>
			</div>			
		);
	}
}
export default Menu;