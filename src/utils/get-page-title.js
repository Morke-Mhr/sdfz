import defaultSettings from '@/settings'

const title = defaultSettings.title || 'upd2架构'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
