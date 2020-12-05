<?php

namespace SiteOrigin\Turbo;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

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
            __DIR__.'/../dist/js/turbo.js' => public_path('vendor/turbo/turbo.js'),
        ]);

        Blade::directive('turbo_script', fn() => '<script src="' . url('vendor/turbo/turbo.js') . '" defer></script>');
    }
}
