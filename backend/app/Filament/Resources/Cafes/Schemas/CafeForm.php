<?php

namespace App\Filament\Resources\Cafes\Schemas;

use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TagsInput;
use Filament\Schemas\Schema;

class CafeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Utama')
                    ->description('Data dasar mengenai kafe.')
                    ->schema([
                        TextInput::make('name')
                            ->label('Nama Kafe')
                            ->required()
                            ->placeholder('Contoh: Kopi Kenangan Mantan'),
                        TextInput::make('open_hours')
                            ->label('Jam Buka')
                            ->placeholder('Contoh: 08:00 - 22:00'),
                        Textarea::make('address')
                            ->label('Alamat Lengkap')
                            ->required()
                            ->columnSpanFull(),
                        Textarea::make('description')
                            ->label('Deskripsi Singkat')
                            ->columnSpanFull(),
                        TagsInput::make('tags')
                            ->label('Tags / Vibe')
                            ->placeholder('Ketik lalu enter (misal: Tenang, Outdoor)')
                            ->columnSpanFull(),
                    ])->columns(2),

                Section::make('Lokasi & Koordinat')
                    ->description('Pastikan titik koordinat akurat.')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('latitude')
                                    ->numeric()
                                    ->required(),
                                TextInput::make('longitude')
                                    ->numeric()
                                    ->required(),
                            ]),
                    ]),

                Section::make('Fasilitas & Kenyamanan')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Select::make('wifi_status')
                                    ->label('Kualitas Wifi')
                                    ->options([
                                        'fast' => '🚀 Kencang (>20 Mbps)',
                                        'standard' => '👌 Standar',
                                        'slow' => '🐢 Lambat',
                                        'none' => '❌ Tidak Ada',
                                    ])
                                    ->native(false)
                                    ->required(),
                                Select::make('socket_status')
                                    ->label('Colokan Listrik')
                                    ->options([
                                        'many' => '⚡ Banyak (Tiap Meja)',
                                        'few' => '🔌 Sedikit (Pojokan)',
                                        'none' => '❌ Tidak Ada',
                                    ])
                                    ->native(false)
                                    ->required(),
                                Toggle::make('musholla_status')
                                    ->label('Tersedia Musholla?')
                                    ->inline(false),
                            ]),
                        Grid::make(2)
                            ->schema([
                                Textarea::make('parking_info')
                                    ->label('Info Parkir')
                                    ->placeholder('Motor aman, mobil susah masuk...'),
                                Textarea::make('toilet_info')
                                    ->label('Kondisi Toilet')
                                    ->placeholder('Bersih, gabung cewek/cowok...'),
                            ]),
                    ]),

                Section::make('Galeri Foto')
                    ->description('Upload foto suasana, menu, dan speedtest di sini.')
                    ->schema([
                        Repeater::make('photos')
                            ->relationship()
                            ->schema([
                                FileUpload::make('file_path')
                                    ->label('Upload Foto')
                                    ->image()
                                    ->directory('cafe-photos')
                                    ->imageEditor()
                                    ->required(),
                                Select::make('category')
                                    ->label('Kategori Foto')
                                    ->options([
                                        'facade' => '🏠 Tampak Depan',
                                        'interior' => '🪑 Interior / Suasana',
                                        'menu' => '📜 Daftar Menu',
                                        'speedtest' => '📶 Hasil Speedtest',
                                    ])
                                    ->required(),
                            ])
                            ->grid(2)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
