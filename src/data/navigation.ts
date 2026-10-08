import type { NavItem } from '../types/content';

export const primaryNav: NavItem[] = [
{ label: 'Studio', to: '/dashboard' },
{ label: 'Write', to: '/modes' },
{ label: 'Prompts', to: '/prompts' },
{ label: 'Library', to: '/library' },
{ label: 'Discover', to: '/discover' }];


export const footerStudio: NavItem[] = [
{ label: 'About', to: '/about' },
{ label: 'Writing Modes', to: '/modes' },
{ label: 'Prompts', to: '/prompts' },
{ label: 'Journal', to: '/journal' }];


export const footerSmallPrint: NavItem[] = [
{ label: 'Privacy', to: '/about#privacy' },
{ label: 'Terms', to: '/about#terms' },
{ label: 'Contact', to: 'mailto:hello@margin.studio' }];


export const footerElsewhere: NavItem[] = [
{ label: 'Instagram', to: 'https://instagram.com' },
{ label: 'Are.na', to: 'https://www.are.na' },
{ label: 'Substack', to: 'https://substack.com' }];