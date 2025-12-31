<?php

namespace App\Filament\Resources\CafePhotos\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CafePhotoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('cafe_id')
                    ->relationship('cafe', 'name')
                    ->required(),
                TextInput::make('file_path')
                    ->required(),
                Select::make('category')
                    ->options(['facade' => 'Facade', 'interior' => 'Interior', 'menu' => 'Menu', 'speedtest' => 'Speedtest'])
                    ->required(),
            ]);
    }
}
