<?php

namespace SiteOrigin\Turbo;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use SiteOrigin\Turbo\Middleware\AddPrefetch;

class TurboServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->publishes([
            __DIR__.'/../dist/js/turbo.min.js' => public_path('vendor/turbo/turbo.min.js'),
        ], 'public');

        $this->publishes([
            __DIR__.'/../dist/js/turbo.js' => resource_path('vendor/turbo/turbo.js'),
        ], 'resources');

        Blade::directive('turbo_script', fn() => '<script src="' . url('vendor/turbo/turbo.min.js') . '" defer></script>');

        Route::aliasMiddleware('analytics-prefetch', AddPrefetch::class);
    }
}
