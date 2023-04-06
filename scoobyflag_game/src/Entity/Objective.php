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
    #[Groups(['Objective:read'])]
    private ?int $id = null;
    
    #[ORM\ManyToOne(inversedBy: 'objectives')]
    private ?Game $game = null;    

    
    #[ORM\Column(nullable:true,length: 255)]
    #[Groups(['Objective:read'])]
    private ?string $type;
    
    #[ORM\Column(nullable:true)]
    private ?int $visionRange = null;
    
    #[ORM\Column(nullable:true)]
    private ?int $activeRange = null;
    
    #[ORM\Column]
    #[Groups(['Objective:read'])]
    private ?float $longitude = null;
    
    #[ORM\Column]
    #[Groups(['Objective:read'])]
    private ?float $latitude = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getGame(): ?Game
    {
        return $this->game;
    }

    public function setGame(?Game $game): self
    {
        $this->game = $game;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getVisionRange(): ?int
    {
        return $this->visionRange;
    }

    public function setVisionRange(?int $visionRange): self
    {
        $this->visionRange = $visionRange;

        return $this;
    }

    public function getActiveRange(): ?int
    {
        return $this->activeRange;
    }

    public function setActiveRange(?int $activeRange): self
    {
        $this->activeRange = $activeRange;

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

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }
}
