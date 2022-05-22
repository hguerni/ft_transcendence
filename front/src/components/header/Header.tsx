import './Header.css';
import HeaderProfile from './HeaderProfile';
import HeaderTabs from './HeaderTabs';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const usePathname = () => {
    const location = useLocation();
    return location.pathname;
  }

  if (usePathname() === "/")
    return (<></>);

  return (
    <div className="navBar">
      <a className="siteTitle" href="/">FT_TRANSCENDANCE</a>
      <HeaderTabs/>
      {/*<HeaderProfile/>*/}
    </div>
  );
}
