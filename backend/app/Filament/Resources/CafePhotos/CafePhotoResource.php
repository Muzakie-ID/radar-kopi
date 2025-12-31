<?php

namespace App\Filament\Resources\CafePhotos;

use App\Filament\Resources\CafePhotos\Pages\CreateCafePhoto;
use App\Filament\Resources\CafePhotos\Pages\EditCafePhoto;
use App\Filament\Resources\CafePhotos\Pages\ListCafePhotos;
use App\Filament\Resources\CafePhotos\Schemas\CafePhotoForm;
use App\Filament\Resources\CafePhotos\Tables\CafePhotosTable;
use App\Models\CafePhoto;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CafePhotoResource extends Resource
{
    protected static ?string $model = CafePhoto::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'category';

    public static function form(Schema $schema): Schema
    {
        return CafePhotoForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CafePhotosTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCafePhotos::route('/'),
            'create' => CreateCafePhoto::route('/create'),
            'edit' => EditCafePhoto::route('/{record}/edit'),
        ];
    }
}
