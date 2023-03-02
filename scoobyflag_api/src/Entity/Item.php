<?php

namespace App\Entity;

use App\Repository\ItemRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ItemRepository::class)]
class Item
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'items')]
    private ?GameTemplate $gameTemplate = null;

    #[ORM\Column(length: 255)]
    #[Groups(["Item:read"])]
    private ?int $visionRange ;
    
    #[ORM\Column]
    #[Groups(["Item:read"])]
    private ?int $activeRange = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(["Item:read"])]
    private ?string $longitude = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(["Item:read"])]
    private ?string $latitude = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(["Item:read"])]
    private ?string $name = null;

    
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

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(string $longitude): self
    {
        $this->longitude = $longitude;

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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

 
}
