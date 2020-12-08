const hoverTime = 100
const fetchers = {}

/**
 * @param url The URL to fetch
 * @param success The success callback
 * @returns {XMLHttpRequest}
 */
function fetchUrl (url, success) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.setRequestHeader('VND.PREFETCH', 'true')
  xhr.setRequestHeader('Accept', 'text/html')
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return
    if (xhr.status !== 200) return
    success(xhr.responseText)
  }
  xhr.send()

  return xhr
}

/**
 * Prefetch a url, then store it in the Turbolinks cache.
 * @param url
 * @returns {XMLHttpRequest}
 */
function prefetchTurbolink (url) {
  return fetchUrl(url, responseText => {
    const doc = document.implementation.createHTMLDocument('prefetch')
    doc.open()
    doc.write(responseText)
    doc.close()
    const snapshot = Turbolinks.Snapshot.fromHTMLElement(doc.documentElement)
    Turbolinks.controller.cache.put(url, snapshot)
  })
}

/**
 * Prefetch a URL if it hasn't already been prefetched
 * @param url
 * @returns {XMLHttpRequest|boolean}
 */
function prefetchUrl (url) {
  if (hasPrefetched(url)) return true;
  return prefetchTurbolink(url)
}

/**
 * Has the given URL already been prefetched.
 * @param url
 * @returns {boolean}
 */
function hasPrefetched (url) {
  return location.href === url || Turbolinks.controller.cache.has(url)
}

/**
 * Is the given URL currently being prefetched.
 * @param url
 * @returns {boolean}
 */
function isPrefetching (url) {
  console.log(!!fetchers[url]);
  return !!fetchers[url]
}

function cancelPrefetching(event) {
  const element = event.target
  clearTimeout(fetchers[element.href])
  delete fetchers[element.href]
  element.removeEventListener('mouseleave', cancelPrefetching)
}

function isExternalURL(url) {
  return new URL(url).host !== (location.host);
}

document.addEventListener('mouseover', event => {
  // Skip non links or links to external URLs
  if (event.target.tagName !== 'A' || isExternalURL(event.target.href)) return false

  const url = event.target.href
  if (hasPrefetched(url) || isPrefetching(url)) return false
  cancelPrefetching(event)

  // Debounce the link hover prefetch
  event.target.addEventListener('mouseleave', cancelPrefetching)
  fetchers[url] = setTimeout(() => prefetchUrl(url), hoverTime)
})

// Change the Turbolinks cache size
document.addEventListener('turbolinks:load', event => { Turbolinks.controller.cache.size = 40 }, { once: true })

document.addEventListener('turbolinks:load', (event) => {
  document.querySelectorAll('a[rel*="prefetch"]').forEach((el) => {
    const url = el.getAttribute('href');
    if (!isExternalURL(url) && !hasPrefetched(url) && !isPrefetching(url)) {
      fetchers[url] = prefetchUrl(url)
    }
  })
})