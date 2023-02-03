<?php

namespace App\Enum;

class ItemEnumType extends EnumType
{
    const LOUPE = 'Loupe';
    const PIEGE = 'Pièege';
    const VERAGLASSES = 'Lunette de véra';
    const SCOOBY_BACK_PACK = 'Sac à dos de scooby';

    protected $name = "itemEnum";

    protected $values = [
        self::LOUPE => self::LOUPE,
        self::PIEGE => self::PIEGE,
        self::VERAGLASSES => self::VERAGLASSES,
        self::SCOOBY_BACK_PACK => self::SCOOBY_BACK_PACK,
    ];

    public static function getValues() {
        return [self::LOUPE, self::PIEGE,  self::VERAGLASSES, self::SCOOBY_BACK_PACK];
    }
}