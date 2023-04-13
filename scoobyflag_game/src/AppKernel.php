<?php

namespace App;

use App\Kernel;
use Nelmio\ApiDocBundle\NelmioApiDocBundle;
use Nelmio\CorsBundle\NelmioCorsBundle;

class AppKernel extends Kernel
{
    public function registerBundles(): iterable
    {
        $bundles = [new NelmioApiDocBundle()];
        return $bundles;
    }
}
