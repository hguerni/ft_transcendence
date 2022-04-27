import { userInfo } from 'os';
import * as React from 'react'
import UserService from '../services/user.service';
import styled from 'styled-components'

function Navbar(){
  let props = {brand: {name: "transcendance", to: "/"}, links: [{name: "Logout", to: UserService.logout}]}
  const { brand, links } = props;
  const NavLinks: any = () => links.map((link: { name: string, to: () => Promise<void> }) => <Li key={link.name}><button onClick={link.to}>{link.name}</button></Li>);
  return (
    <Navbarr>
      <Brand href={brand.to}>{brand.name}</Brand>
      <Ul>
        <NavLinks />
      </Ul>
    </Navbarr >
  )
};

const Theme = {
  colors: {
    bg: `#fff`,
    dark: `#24292e`,
    light: `#EEEEEE`,
    red: `#ff5851`,
  },
  fonts: {
    body: `IBM Plex Sans, sans-serif`,
    heading: `IBM Plex Sans, sans-serif`,
  }
}

const Navbarr = styled.nav`
  background: ${Theme.colors.dark};
  font-family: ${Theme.fonts.heading};
  color: ${Theme.colors.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
  a { color: white; text-decoration: none; }`;

const Brand = styled.a`
  font-family: 'CrickxRegular';
  font-weight: lighter;
  font-style: normal;
  margin-left: 1rem;
  padding-right: 1rem;`;

const Ul = styled.ul`
  display: flex;
  flex-wrap: nowrap;`;

const Li = styled.li`
  flex: 0 0 auto;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  -webkit-tap-highlight-color: transparent;
  align-items: center;
  color: #999;
  height: 100%;
  justify-content: center;
  text-decoration: none;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  -webkit-tap-highlight-color: transparent;
  align-items: left;
  color: #999;
  display: flex;
  font-size: 14px;
  height: 50px;
  justify-content: center;
  line-height: 16px;
  margin: 0 1.125rem ;
  text-decoration: none;
  background-color: transparent;
  white-space: nowrap;`
  

export default Navbar;