export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Channel 4",
  description:
    "Experience random, interesting content from all over the internet.",
  mainNav: {
    about: {
      title: 'About',
      href: '/about'
    },
    addSite: {
      title: 'Add website',
      href: '/submit-url',
    },
    browseTopics: {
      title: 'Browse topics',
      href: ' /browse'
    },
    changeTags: {
      title: "Change tags",
      href: "/submit-tag",
    },
    dashboard: {
      title: 'Dashboard',
      href: '/dashboard'
    },
    feedback: {
      title: 'Send feedback',
      href: '/feedback'
    },
    landing: {
      title: 'Landing',
      href: '/landing'
    },
    stats: {
      title: 'Stats',
      href: '/stats'
    },
  },
  links: {
    discord: "https://discord.gg/wuPYfbYdXy",
    twitter: "https://twitter.com/StateChannel_4",
    github: "https://github.com/State-Channel-4/Channel4-pocv2",
    docs: "https://github.com/State-Channel-4/Channel4-pocv2",
    home: "/",
    me: "/me",
    signIn: "/sign-in",
    signUp: "/sign-up",
    account: "/account",
    discover: "/discover",
    submitUrl: "/submit-url",
    submitTag: "/submit-tag",
  },
}
