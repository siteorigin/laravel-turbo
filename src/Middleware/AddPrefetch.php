<?php

namespace SiteOrigin\Turbo\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Analytics\AnalyticsFacade as Analytics;
use Spatie\Analytics\Period;
use Symfony\Component\DomCrawler\Crawler;

class AddPrefetch
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Get all the next paths from Google Analytics
        $path = $this->getAnalyticsPath($request->fullUrl());
        $nextPaths = $this->getNextPaths($path);

        $crawler = new Crawler($response->getContent());

        foreach($crawler->filterXPath('//a') as $el) {
            if (empty($nextPaths[$this->getAnalyticsPath($el->getAttribute('href'))])) continue;

            $rel = array_filter(explode(' ', $el->getAttribute('rel')));
            if( !in_array('prefetch', $rel) ) $rel[] = 'prefetch';

            $el->setAttribute('rel', implode(' ', $rel));
        }

        $response->setContent($crawler->html());


        return $response;
    }

    public function getNextPaths($path)
    {
        // This result is cached by Spatie Analytics
        $result = Analytics::performQuery(
            Period::days(30),
            'ga:pageViews',
            [
                'dimensions' => 'ga:pagePath',
                'filters' => 'ga:pageViews>=10;ga:previousPagePath==' . $path,
                'sort' => '-ga:pageViews',
                'max-results' => 25
            ]
        );

        return collect($result->rows)
            ->reject(fn($row) => $row[0] == $path)
            ->mapWithKeys(fn($row) => [$row[0] => $row[1]]);
    }

    public function getAnalyticsPath(string $path)
    {
        // TODO check that the website address is the same as config('app.url')
        $path = parse_url($path);
        return ( $path['path'] ?? '/' ) . ( !empty($path['query']) ? '?' . $path['query'] : '' );
    }
}