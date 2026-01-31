import { FC, useContext } from 'react';
import { Link } from 'react-router';
import { styled } from '@mui/material';
import config from 'src/context/config';
import { CustomizerContext } from 'src/context/CustomizerContext';
import FoodifyLogo from 'src/assets/images/logos/foodify-logo.png';

const Logo: FC = () => {
  const { isCollapse, isSidebarHover } = useContext(CustomizerContext);
  const TopbarHeight = config.topbarHeight;

  const LinkStyled = styled(Link)(() => ({
    height: TopbarHeight,
    width: isCollapse == "mini-sidebar" && !isSidebarHover ? '40px' : '180px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  }));

  return (
    <LinkStyled to="/">
      <img 
        src={FoodifyLogo} 
        alt="Foodify Logo" 
        style={{
          height: '100%',
          width: '100%',
          objectFit: 'contain',
        }}
      />
    </LinkStyled>
  );
};

export default Logo;
