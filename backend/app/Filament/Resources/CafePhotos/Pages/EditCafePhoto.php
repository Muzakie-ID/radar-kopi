<?php

namespace App\Filament\Resources\CafePhotos\Pages;

use App\Filament\Resources\CafePhotos\CafePhotoResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCafePhoto extends EditRecord
{
    protected static string $resource = CafePhotoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
