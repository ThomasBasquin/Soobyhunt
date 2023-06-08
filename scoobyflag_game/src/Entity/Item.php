<?php

namespace App\Entity;

use App\Repository\ItemRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ItemRepository::class)]
class Item
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['Item:read'])]
    private ?int $id = null;
    
    #[ORM\ManyToOne(inversedBy: 'items')]
    private ?Game $game = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(['Item:read'])]
    private ?string $type = null;
    
    #[ORM\Column]
    #[Groups(['Item:read'])]
    private ?int $quantity = null;
    
    #[ORM\Column]
    #[Groups(['Item:read'])]
    private ?float $latitude = null;
    
    #[ORM\Column(length: 255)]
    #[Groups(['Item:read'])]
    private ?string $longitude = null;

    #[ORM\OneToMany(mappedBy: 'item', targetEntity: ItemUser::class)]
    private Collection $itemUsers;

    public function __construct()
    {
        $this->itemUsers = new ArrayCollection();
    }

  
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

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;

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

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(string $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    /**
     * @return Collection<int, ItemUser>
     */
    public function getItemUsers(): Collection
    {
        return $this->itemUsers;
    }

    public function addItemUser(ItemUser $itemUser): self
    {
        if (!$this->itemUsers->contains($itemUser)) {
            $this->itemUsers->add($itemUser);
            $itemUser->setItem($this);
        }

        return $this;
    }

    public function removeItemUser(ItemUser $itemUser): self
    {
        if ($this->itemUsers->removeElement($itemUser)) {
            // set the owning side to null (unless already changed)
            if ($itemUser->getItem() === $this) {
                $itemUser->setItem(null);
            }
        }

        return $this;
    }
}
