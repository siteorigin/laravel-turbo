## Speed Up Your Laravel Site With Tubolinks

This package is a simple wrapper around [Turbolinks](https://github.com/turbolinks/turbolinks). It adds support for prefetching, so navigation becomes nearly instant. Pages are prefetched when a user hovers over a link, or any links woth `rel="prefetch"` are found.

## Installation

*Installation instructions coming once this package is on Packagist.*

## Usage

You can add `@turbo_script` to your HTML header. For this to work, you need to publish the Javascript to your public folder with `php artisan vendor:publish --provider="SiteOrigin\Turbo\TurboServiceProvider" --tag="public"`

```
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>@yield('title', 'Welcome')</title>
    
    @include('partials.analytics')
    @turbo_script
</head>
```

Or, you can include it in your existing Javascript. To do this, publish the Javascript to your resources folder instead with `php artisan vendor:publish --provider="SiteOrigin\Turbo\TurboServiceProvider" --tag="resources"`

Then add the following line to your `resources/js/app.js` file.

```
require('../vendor/turbo/turbo')
```

## Prefetching from Google Anlytics Data

Google Analytics stores useful data about which page a user is likely to visit next, after viewing the current page. This package integrates with [Spatie's Analytics Package](https://github.com/spatie/laravel-analytics) to automatically add `rel="prefetch"` to the most likely next pages. Make sure you've properly configured the Laravel Analytics package, then add `analytics-prefetch` middleware to all routes you want to process.

```
Route::get('/', function () {
    return view('welcome');
})->name('home')->middleware('analytics-prefetch');
```

Alternatively, add `SiteOrigin\Turbo\Middleware\AddPrefetch` to your global middleware. In `app\Http\Kernel.php`, add `\SiteOrigin\Turbo\Middleware\AddPrefetch::class` to the `$middlewareGroups` variable, in the `web` section.

Caching is hanled by the Google Ananlytics package.