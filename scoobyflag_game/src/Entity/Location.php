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

    #[ORM\Column]
    #[Groups(['Game:read'])]
    private ?float $latitude = null;

    #[ORM\Column]
    #[Groups(['Game:read'])]
    private ?float $longitude = null;

    #[ORM\ManyToOne(inversedBy: 'locations')]
    private ?GameInterdictionLocalisation $localisation = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getLocalisation(): ?GameInterdictionLocalisation
    {
        return $this->localisation;
    }

    public function setLocalisation(?GameInterdictionLocalisation $localisation): self
    {
        $this->localisation = $localisation;

        return $this;
    }
}
