import { uniqueId } from 'lodash';

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}
import {
  IconUsers,
  IconUserPlus,
  IconHome,
  IconUserBolt,
} from '@tabler/icons-react';

const Menuitems: MenuitemsType[] = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Home',
    icon: IconHome,
    href: '/',
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUserBolt,
    href: '/users',
  },
  {
    id: uniqueId(),
    title: 'Tenants',
    icon: IconUsers,
    href: '/tenants',
  },
  {
    id: uniqueId(),
    title: 'Agents',
    icon: IconUserPlus,
    href: '/agents',
  },
];

export default Menuitems;
