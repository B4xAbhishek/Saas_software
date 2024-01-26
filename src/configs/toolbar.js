export default {
  // apps quickmenu
  apps: [{ icon: 'mdi-home-city', key: 'menu.projects', text: 'Projects', link: '/admin/projects', accessLevel: ['customer'] },
    { icon: 'mdi-camera', key: 'menu.cameras', text: 'Cameras', link: '/admin/cameras' },
    { icon: 'mdi-account', key: 'menu.users', text: 'Users', link: '/admin/users' },
    { icon: 'mdi-email', key: 'menu.contacts', text: 'Contacts', link: '/dashboard/contacts' }],

  // user dropdown menu
  user: [
    { icon: 'mdi-account-box-outline', key: 'menu.profile', text: 'Profile', link: '/profile' }
  ]
}
