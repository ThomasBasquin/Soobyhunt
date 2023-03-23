<?php

namespace App\Entity;

use App\Repository\LocationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: LocationRepository::class)]
class Location
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    
    #[ORM\ManyToOne(inversedBy: 'locations')]
    private ?GameZone $gameZone = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(['GameZone:read'])]
    private ?string $latitude = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(['GameZone:read'])]
    private ?string $longitude = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGameZone(): ?GameZone
    {
        return $this->gameZone;
    }

    public function setGameZone(?GameZone $gameZone): self
    {
        $this->gameZone = $gameZone;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(string $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(string $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }
}
