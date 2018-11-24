// ===========================================================================
//     data area
// ===========================================================================
export const data = {
  steps: [
    [
      {
        id: '$0_1111', name: 'index', url: '/index', session: 12000,
      },
    ],
    [
      {
        id: '$1_1111', name: 'page1', url: '/page1', session: 6000,
      },
      {
        id: '$1_2222', name: 'page2', url: '/page2', session: 2000,
      },
      {
        id: '$1_3333', name: 'page3', url: '/page2', session: 1000,
      },
    ],
    [
      {
        id: '$2_1111', name: 'index', url: '/index', session: 2200,
      },
      {
        id: '$2_2222', name: 'page1', url: '/page1', session: 2000,
      },
      {
        id: '$2_3333', name: 'page2', url: '/page2', session: 1400,
      },
    ],
    [
      {
        id: '$3_1111', name: 'index', url: '/index', session: 1200,
      },
      {
        id: '$3_2222', name: 'page1', url: '/page1', session: 1000,
      },
      {
        id: '$3_3333', name: 'page2', url: '/page2', session: 700,
      },
      {
        id: '$3_4444', name: 'page3', url: '/page3', session: 1400,
      },
    ],
  ],
};

export const edges = [
  // level 0
  [
    { from: '$0_1111', to: '$1_1111', session: 6000 },
    { from: '$0_1111', to: '$1_2222', session: 2000 },
    { from: '$0_1111', to: '$1_3333', session: 1000 },
  ],
  // level 1
  [
    { from: '$1_1111', to: '$2_1111', session: 1234 },
    { from: '$1_1111', to: '$2_2222', session: 1000 },
    { from: '$1_1111', to: '$2_2222', session: 100 },
    { from: '$1_1111', to: '$2_3333', session: 100 },
    { from: '$1_2222', to: '$2_1111', session: 100 },
    { from: '$1_3333', to: '$2_1111', session: 100 },
  ],
  // level 2
  [
    { from: '$2_1111', to: '$3_1111', session: 234 },
    { from: '$2_1111', to: '$3_2222', session: 200 },
    { from: '$2_1111', to: '$3_2222', session: 100 },
    { from: '$2_1111', to: '$3_3333', session: 100 },
    { from: '$2_2222', to: '$3_1111', session: 100 },
    { from: '$2_3333', to: '$3_1111', session: 100 },
  ],
];
