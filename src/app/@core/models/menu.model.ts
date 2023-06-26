export interface IMenu {
  label: string;
  items: IMenuItem[];
  permissions?: string[];
}

export interface IMenuItem {
  label: string;
  icon: string;
  routerLink: string[];
}
