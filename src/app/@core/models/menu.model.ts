export interface IMenu {
  label: string;
  items: IMenuItem[];
}

export interface IMenuItem {
  label: string;
  icon: string;
  routerLink: string[];
}
