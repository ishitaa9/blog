import React, { useState } from 'react';
import {APP_NAME} from '../config';
import Link from 'next/link';
import NProgress from 'nprogress';
import {signout, isAuth} from '../actions/auth';
import Router from 'next/router';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
// import '.././node_modules/nprogress/nprogress.css';
import Search from './blog/Search'

Router.onRouteChangeStart = url => NProgress.start()
Router.onRouteChangeComplete = url => NProgress.done()
Router.onRouteChangeError = url => NProgress.done()

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <React.Fragment>
      <Navbar color="light" light expand="md">
        <Link href="/">
          <NavLink style={{cursor: 'pointer', color:'	darkorchid'}} className="font-weight-bold">SPACERTA</NavLink>
          </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>

          <React.Fragment>
          <NavItem>
                <Link href="/blogs">
                  <NavLink style={{cursor: 'pointer', color:'	blueviolet'}}>Blogs</NavLink>
                </Link>
          </NavItem>

            <NavItem>
                <Link href="/contact">
                  <NavLink style={{cursor: 'pointer', color:'	blueviolet'}}>Contact</NavLink>
                </Link>
            </NavItem>
           </React.Fragment>


         {!isAuth() && (<React.Fragment>
          <NavItem>
                <Link href="/signin">
                  <NavLink style={{cursor: 'pointer', color:'	blueviolet'}}>Signin</NavLink>
                </Link>
            </NavItem>
            <NavItem>
                <Link href="/signup">
                  <NavLink style={{cursor: 'pointer', color:'	blueviolet'}}>Signup</NavLink>
                </Link>
            </NavItem>
           </React.Fragment>
           )}

            {isAuth() && isAuth().role === 0 && (
             <NavItem>
                <Link href="/user">
                  <NavLink style={{cursor: 'pointer', color:'	blueviolet'}}>
                    {`${isAuth().name}'s Dashboard`}
                  </NavLink>
                  </Link>
            </NavItem>
            )}

            {isAuth() && isAuth().role === 1 && (
             <NavItem>
                <Link href="/admin">
                  <NavLink style={{cursor: 'pointer', color:'	blueviolet'}}>
                    {`${isAuth().name}'s Dashboard`}
                  </NavLink>
                  </Link>
            </NavItem>
            )}

            {isAuth() && (
             <NavItem>
                  <NavLink style={{cursor: 'pointer', color:'	blueviolet'}} onClick={() => signout(() => Router.replace(`/signin`))}>Signout</NavLink>
            </NavItem>
            )}

          <NavItem>
                <Link href="/user/crud/blog">
                  <NavLink className="btn btn-primary text-light" style={{cursor: 'pointer'}}>Write a blog</NavLink>
                </Link>
            </NavItem>

          </Nav>
          {/* <NavbarText>Simple Text</NavbarText> */}
        </Collapse>
      </Navbar>
      <Search />
    </React.Fragment>
  );
}

export default Header;