<?php

namespace App\Filament\Resources\CafePhotos\Pages;

use App\Filament\Resources\CafePhotos\CafePhotoResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCafePhotos extends ListRecords
{
    protected static string $resource = CafePhotoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
