export default [
  {
    path: '/candidates',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'CandidateList',
        component: () => import('./views/CandidateListView.vue'),
      },
    ],
  },
]
