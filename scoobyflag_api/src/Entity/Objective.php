<?php

namespace App\Entity;

use App\Repository\ObjectiveRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ObjectiveRepository::class)]
class Objective
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["Objective:read"])]
    private ?int $id = null;
    
    #[ORM\ManyToOne(inversedBy: 'objectives')]
    private ?GameTemplate $gameTemplate = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(["Objective:read"])]
    private ?string $latitude = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(["Objective:read"])]
    private ?string $longitude = null;
    
    #[ORM\Column]
    #[Groups(["Objective:read"])]
    private ?int $visionRange = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(["Objective:read"])]
    private ?int $activeRange = null;

    public function __construct()
    {
        $this->visionRange = 10;
        $this->activeRange = 10;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGameTemplate(): ?GameTemplate
    {
        return $this->gameTemplate;
    }

    public function setGameTemplate(?GameTemplate $gameTemplate): self
    {
        $this->gameTemplate = $gameTemplate;

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

    public function getVisionRange(): ?int
    {
        return $this->visionRange;
    }

    public function setVisionRange(int $visionRange): self
    {
        $this->visionRange = $visionRange;

        return $this;
    }

    public function getActiveRange(): ?int
    {
        return $this->activeRange;
    }

    public function setActiveRange(int $activeRange): self
    {
        $this->activeRange = $activeRange;

        return $this;
    }
}
