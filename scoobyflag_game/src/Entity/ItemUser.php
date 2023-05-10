<?php

namespace App\Entity;

use App\Repository\ItemUserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ItemUserRepository::class)]
class ItemUser
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Item $item = null;

    #[ORM\ManyToOne(inversedBy: 'used')]
    private ?User $getBy = null;

    #[ORM\Column]
    #[Groups(['User:read'])]
    private ?bool $used = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getItem(): ?Item
    {
        return $this->item;
    }

    public function setItem(?Item $item): self
    {
        $this->item = $item;

        return $this;
    }

    public function getGetBy(): ?User
    {
        return $this->getBy;
    }

    public function setGetBy(?User $getBy): self
    {
        $this->getBy = $getBy;

        return $this;
    }

    public function isUsed(): ?bool
    {
        return $this->used;
    }

    public function setUsed(bool $used): self
    {
        $this->used = $used;

        return $this;
    }
}
