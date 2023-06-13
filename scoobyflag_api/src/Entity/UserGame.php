<?php

namespace App\Entity;

use App\Repository\UserGameRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserGameRepository::class)]
class UserGame
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'userGames')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'userGames')]
    private ?Game $game = null;

    #[ORM\Column]
    private ?int $objectifCaptured = null;

    #[ORM\Column]
    private ?int $itemGet = null;

    #[ORM\Column]
    private ?int $itemUsed = null;

    #[ORM\Column]
    private ?bool $win = null;

    #[ORM\Column]
    private array $json = [];


    public function __construct()
    {
        $this->itemGet = 0;
        $this->itemUsed = 0;
        $this->objectifCaptured = 0;
        $this->win = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
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

    public function getObjectifCaptured(): ?int
    {
        return $this->objectifCaptured;
    }

    public function setObjectifCaptured(int $objectifCaptured): self
    {
        $this->objectifCaptured = $objectifCaptured;

        return $this;
    }

    public function getItemGet(): ?int
    {
        return $this->itemGet;
    }

    public function setItemGet(int $itemGet): self
    {
        $this->itemGet = $itemGet;

        return $this;
    }

    public function getItemUsed(): ?int
    {
        return $this->itemUsed;
    }

    public function setItemUsed(int $itemUsed): self
    {
        $this->itemUsed = $itemUsed;

        return $this;
    }

    public function isWin(): ?bool
    {
        return $this->win;
    }

    public function setWin(bool $win): self
    {
        $this->win = $win;

        return $this;
    }

    public function getJson(): array
    {
        return $this->json;
    }

    public function setJson(array $json): self
    {
        $this->json = $json;

        return $this;
    }
}
